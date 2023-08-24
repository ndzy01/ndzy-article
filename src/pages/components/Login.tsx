import { Button, Form, Input, Space } from 'antd';
import { useContext, useState } from 'react';
import { ReduxContext } from '../../redux';
import { serviceAxios } from '../../utils';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } };
const Login = () => {
  const { state, dispatch } = useContext(ReduxContext);
  const [show, setShow] = useState(false);
  const login = (values: { mobile: string; password: string }) => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });
    serviceAxios
      .post('/users/login', { ...values })
      .then((res) => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
        if (res && res.data && res.data.token) {
          localStorage.setItem('token', res.data.token);
          window.location.reload();
        }
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };
  const signOut = () => {
    localStorage.setItem('token', '');
    window.location.reload();
  };

  return (
    <div>
      <Space>
        <Button onClick={() => setShow(!show)}>登录</Button>
        <Button onClick={signOut}>登出</Button>
      </Space>
      {show && (
        <Form {...formItemLayout} name="login" onFinish={login} scrollToFirstError>
          <Form.Item name="mobile" label="手机号" rules={[{ required: true, message: '请输入你的手机号!' }]}>
            <Input className="w-100" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            <Button loading={state.loading} type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default Login;
