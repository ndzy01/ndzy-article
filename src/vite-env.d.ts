/// <reference types="vite/client" />

interface ITree {
  id: string;
  pId: string;
  name: string;
  content: string;
  isLeaf: boolean;
  children: ITree[];
}

interface User {
  id: string;
  nickname: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
