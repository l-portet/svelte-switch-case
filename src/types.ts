import { SourceMap } from 'magic-string';

export interface Node {
  type: string;
  name: string;
  tagName?: string;
  value: string;
  properties: any[];
  selfClosing: boolean;
  children: Node[];
  branches: Node[];
  position: any;
  expression: any;
}

export interface Injection {
  value: string;
  start: number;
  end: number;
}

export interface Position {
  start: number;
  end: number;
}

export interface PreprocessorOptions {
  content: string;
  filename: string;
}

export interface PreprocessorOutput {
  code: string;
  map: SourceMap;
}
