/* eslint-disable react-hooks/exhaustive-deps */
import Vditor from 'vditor';
import { generateUUID } from './utils';
import { useLayoutEffect } from 'react';

const Preview = ({ md }: { md: string }) => {
  const id = generateUUID();

  useLayoutEffect(() => {
    const VD = new Vditor(`preview-${id}`, {
      cache: {
        enable: false,
      },
      toolbar: ['fullscreen', 'outline', 'preview'],
      minHeight: 200,
      value: md || '',
      outline: {
        // 显示大纲
        enable: true,
        position: 'left',
      },
      after() {
        const evt = document.createEvent('Event');

        evt.initEvent('click', true, true);
        VD!.vditor!.toolbar!.elements!.preview!.firstElementChild!.dispatchEvent(evt);
      },
    });
  }, [md]);

  return <div id={`preview-${id}`} />;
};

export default Preview;
