/* eslint-disable @typescript-eslint/no-explicit-any */
import * as monaco from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';

loader.config({ monaco });

const IEditor = ({ value, onChange }: any) => {
  return (
    <Editor
      height="60vh"
      theme="vs-dark"
      defaultLanguage="markdown"
      language="markdown"
      value={value}
      onChange={onChange}
    />
  );
};

export default IEditor;
