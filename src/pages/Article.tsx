/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useContext } from 'react';
import { useMount } from 'ahooks';
import { Tree, Space, Popconfirm, Spin, Button, Drawer, Form, Input } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { ReduxContext } from '../redux';
import { serviceAxios } from '../utils';
import Editor from './components/Editor';
import Preview from './components/Preview';

const { DirectoryTree } = Tree;
const Home = () => {
  const [form] = Form.useForm();
  const { state, dispatch } = useContext(ReduxContext);
  const [articles, setArticles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editType, setEditType] = useState('0');

  const arrayToTree = (list: ITree[], root: string): any => {
    return list
      .filter((item) => item.pId === root)
      .map((item) => {
        const isLeaf = arrayToTree(list, item.id).length === 0;

        return {
          ...item,
          title: item.name,
          key: item.id,
          isLeaf,
          children: arrayToTree(list, item.id),
        };
      });
  };

  const getAll = () => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });

    serviceAxios
      .get('/tree')
      .then((res) => {
        setArticles(arrayToTree(res.data, '0'));

        dispatch({ type: 'UPDATE', payload: { loading: false } });
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  const goEdit = () => {
    setOpen(true);
    setEditType('1');
  };

  const goCreate = () => {
    setOpen(true);
    setEditType('0');
  };

  const del = () => {
    if (!state.article?.id || !state.article?.isLeaf) {
      return;
    }

    dispatch({ type: 'UPDATE', payload: { loading: true } });

    serviceAxios
      .delete(`/tree/${state.article?.id}`)
      .then(() => {
        getAll();
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  const update = (values: any) => {
    if (editType === '0') {
      serviceAxios
        .post('/tree', {
          name: values.name,
          content: values.content,
          pId: state.article?.id ? state.article?.id : '0',
        })
        .finally(() => {
          form.resetFields();
          setOpen(false);
          getAll();
        });
    } else if (editType === '1') {
      if (!state.article?.id) {
        return;
      }

      serviceAxios
        .patch(`/tree/${state.article?.id}`, {
          name: values.name,
          content: values.content,
        })
        .finally(() => {
          form.resetFields();
          setOpen(false);
          getAll();
        });
    }
  };

  const onSelect: DirectoryTreeProps['onSelect'] = (_keys, info) => {
    dispatch({ type: 'UPDATE', payload: { article: info.node as unknown as ITree } });
  };

  const onClose = () => {
    setOpen(false);
  };

  useMount(() => {
    getAll();
  });

  return (
    <div>
      {state.loading ? (
        <Spin />
      ) : (
        articles.length > 0 && (
          <>
            <Space>
              <Button
                onClick={() => {
                  dispatch({ type: 'UPDATE', payload: { article: undefined } });
                }}
              >
                清空
              </Button>
              <Button onClick={goCreate}>新增</Button>
              <Button onClick={goEdit}>编辑</Button>
              <Popconfirm title="删除将无法恢复,确定删除?" onConfirm={del}>
                <Button>删除</Button>
              </Popconfirm>
            </Space>
            <DirectoryTree
              selectedKeys={state.article?.id ? [state.article?.id] : []}
              onSelect={onSelect}
              showLine
              defaultExpandAll
              treeData={articles}
            />

            {state.article?.content && <Preview md={state.article?.content} />}

            {open && (
              <Drawer
                width="100%"
                title={editType === '0' ? '新增' : '编辑'}
                placement="right"
                onClose={onClose}
                open={open}
              >
                <Form
                  initialValues={
                    editType === '1'
                      ? {
                          name: state.article?.name,
                          content: state.article?.content,
                        }
                      : undefined
                  }
                  name="update"
                  onFinish={update}
                  scrollToFirstError
                  form={form}
                >
                  <Form.Item
                    name="name"
                    label="名称"
                    rules={[
                      {
                        required: true,
                        message: '名称不能为空',
                      },
                    ]}
                  >
                    <Input.TextArea rows={1} />
                  </Form.Item>

                  <Form.Item
                    name="content"
                    label="内容"
                    rules={[
                      {
                        required: true,
                        message: '内容不能为空',
                      },
                    ]}
                  >
                    <Editor />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      保存
                    </Button>
                  </Form.Item>
                </Form>
              </Drawer>
            )}
          </>
        )
      )}
    </div>
  );
};

export default Home;
