/// <reference types="vite/client" />

interface ITree {
  id: string;
  pId: string;
  name: string;
  content: string;
  isLeaf: boolean;
  children: ITree[];
}
