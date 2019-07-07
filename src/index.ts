import * as monaco from 'monaco-editor';
import { debounce } from 'debounce';
import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';

const tileSize = 20;

{
  console.log('Ready');

  const simmis = {};

  const canvas = new fabric.Canvas('demoCanvas');

  const createRect = (color: string) => new fabric.Rect({
    left: 0,
    top: 0,
    fill: color,
    width: tileSize,
    height: tileSize
  });

  const createGrid = (canvas: Canvas, tileSize) => {
    for (var i = 0; i < canvas.getWidth() / tileSize; i++) {
      const path = new fabric.Path(`M 0 0 L 0 ${canvas.getHeight()}`);
      path.set({ left: i * tileSize, top: 0, stroke: 'green' });
      canvas.add(path)
    }
    for (var i = 0; i < canvas.getHeight() / tileSize; i++) {
      const path = new fabric.Path(`M 0 0 L ${canvas.getWidth()} 0`);
      path.set({ top: i * tileSize, left: 0, stroke: 'green' });
      canvas.add(path)
    }
  }

  class Simmi {
    color = 'tomato';
    x = 0;
    y = 0;
    vis;
    static register(type) {
      console.log(this.name);
      simmis[this.name] = this;
    }
    constructor() {
      setInterval(() => {
        this.run();
      }, 1000);
      this.vis = createRect(this.color);
      canvas.add(this.vis);
    }

    run() { }
    move(dir) {
      switch (dir) {
        case DIRECTION.DOWN:
          this.y = this.y + tileSize;
          break;
        case DIRECTION.UP:
          this.y = this.y - tileSize;
          break;
        case DIRECTION.LEFT:
          this.x = this.x - tileSize;
          break;
        case DIRECTION.RIGHT:
          this.x = this.x + tileSize;
          break;
      }
      this.updatePosition();
      canvas.renderAll();
    }

    updatePosition() {
      this.vis.set({ left: this.x, top: this.y })
    }
  }

  const DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
  }

  const createSimmi = (type) => {
    new (simmis[type.name])()
  }

  createGrid(canvas, tileSize);

  monaco.languages.typescript.javascriptDefaults.addExtraLib(`
    declare class Simmi {
      run: () => void;
      move: (direction: string) => void;
    } 
    declare function createSimmi;
    declare var createSimmi;
  `)
  const editor = monaco.editor.create(document.getElementById('container'), {
    value: localStorage.getItem('code') || '',
    language: 'javascript'
  });

  const applyCode = () => {
    const v = editor.getValue();
    localStorage.setItem('code', v)
    try {
      eval(v)
    } catch {

    }
  }
  editor.onDidChangeModelContent(debounce(applyCode, 500));

  applyCode();
}
