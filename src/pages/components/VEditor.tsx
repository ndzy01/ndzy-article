import Vditor from 'vditor';
import { useInterval } from 'ahooks';
import { generateUUID } from './utils';
import { useResponsive } from '../../hooks';

const Editor = ({
  value,
  onChange,
  placeholder = '请输入',
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) => {
  const id = generateUUID();
  const responsive = useResponsive();
  const clear = useInterval(() => {
    if (document.getElementById(`vditor-${id}`)) {
      new Vditor(`vditor-${id}`, {
        cache: {
          enable: false,
        },
        toolbar: responsive.large
          ? [
              'outline',
              '|',
              'headings',
              'bold',
              'italic',
              'strike',
              'quote',
              'line',
              'link',
              'table',
              '|',
              'list',
              'ordered-list',
              'check',
              'outdent',
              'indent',
              '|',
              'code',
              'inline-code',
              '|',
              'insert-after',
              'insert-before',
              '|',
              'redo',
              'undo',
              'preview',
              'export',
              'fullscreen',
            ]
          : ['ordered-list', 'fullscreen'],
        input: (v) => {
          onChange && onChange(v);
        },
        outline: {
          enable: true,
          position: 'left',
        },
        minHeight: 200,
        placeholder,
        value: value || '',
      });
      clear();
    }
  }, 100);

  return <div id={`vditor-${id}`} />;
};

export default Editor;
