/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useContext } from 'react';
import { useMount } from 'ahooks';
import { Tree, Space, Popconfirm, Spin, Button, Drawer, Form, Input, message } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { ReduxContext } from '../redux';
import { serviceAxios } from '../utils';
import Editor from './components/VEditor';
import Preview from './components/VPreview';

const { DirectoryTree } = Tree;
const Home = () => {
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
    if (!state.article?.id || !state.article?.isLeaf) {
      message.warning('请选择您要更新的文章');

      return;
    }

    setOpen(true);
    setEditType('1');
  };

  const goCreateRoot = () => {
    dispatch({ type: 'UPDATE', payload: { article: undefined } });
    setOpen(true);
    setEditType('0');
  };

  const goCreate = () => {
    if (!state.article?.id) {
      message.warning('请先选择一篇文章');

      return;
    }

    setOpen(true);
    setEditType('0');
  };

  const del = () => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });

    serviceAxios
      .delete(`/tree/${state.article?.id}`)
      .then(() => {
        window.location.reload();
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
          setOpen(false);
          getAll();
        });
    } else if (editType === '1') {
      serviceAxios
        .patch(`/tree/${state.article?.id}`, {
          name: values.name,
          content: values.content,
        })
        .finally(() => {
          setOpen(false);
          window.location.reload();
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
              <Button onClick={goCreateRoot}>新增根目录</Button>
              <Button onClick={goCreate}>新增</Button>
              <Button onClick={goEdit}>编辑</Button>
              {state.article?.id && state.article.isLeaf && (
                <Popconfirm title="删除将无法恢复,确定删除?" onConfirm={del}>
                  <Button>删除</Button>
                </Popconfirm>
              )}
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
                destroyOnClose
                width="100%"
                title={editType === '0' ? '新增' : '编辑'}
                placement="right"
                onClose={onClose}
                open={open}
              >
                {editType === '1' ? (
                  <Form
                    preserve={false}
                    initialValues={{
                      name: state.article?.name,
                      content: state.article?.content,
                    }}
                    name="update"
                    onFinish={update}
                    scrollToFirstError
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
                      <Button loading={state.loading} type="primary" htmlType="submit">
                        保存
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <Form name="update" onFinish={update} scrollToFirstError preserve={false}>
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
                      <Button loading={state.loading} type="primary" htmlType="submit">
                        保存
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </Drawer>
            )}
          </>
        )
      )}
    </div>
  );
};

export default Home;
