import { useState } from 'react';
import axios from "axios";

function App() {
    // 状态管理
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // 加载状态
    const [serverError, setServerError] = useState(''); // 服务器错误信息

    // 切换登录/注册模式
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ username: '', password: '', confirmPassword: '' });
        setErrors({});
        setServerError(''); // 切换模式时清除错误
    };

    // 处理表单输入变化
    const handleChange = (e) => {
        const { name, value } = e.target;
        // 输入变化时清除对应字段的错误
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setFormData(prev => ({ ...prev, [name]: value }));
        setServerError(''); // 输入时清除服务器错误
    };

    // 表单验证
    const validateForm = () => {
        const newErrors = {};
        const { username, password, confirmPassword } = formData;

        // 用户名验证
        if (!username.trim()) {
            newErrors.username = '用户名不能为空';
        } else if (/[^a-zA-Z0-9_]/.test(username)) {
            newErrors.username = '用户名只能包含字母、数字和下划线';
        }

        // 密码验证
        if (!password) {
            newErrors.password = '密码不能为空';
        } else if (password.length < 6) {
            newErrors.password = '密码至少6个字符';
        }

        // 注册时验证确认密码
        if (!isLogin && password !== confirmPassword) {
            newErrors.confirmPassword = '两次密码输入不一致';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 处理表单提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(''); // 提交前清除服务器错误

        if (validateForm()) {
            setIsLoading(true); // 开始加载
            const { username, password } = formData;

            try {
                const url = isLogin ? '/api/login' : '/api/register';
                const response = await axios.post(url, { username, password });

                if (response.data.success) {
                    const userData = response.data.data;
                    console.log(`${isLogin ? '登录' : '注册'}成功：`, userData);

                    // 存储用户信息
                    const userInfo = {
                        username: userData.username,
                        balance: userData.balance || 0,
                        token: userData.token || '' // 假设接口返回token
                    };
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));

                    // 发送登录成功事件
                    window.dispatchEvent(new CustomEvent('userLoggedIn', {
                        detail: userInfo
                    }));

                    // 可以添加跳转逻辑，例如导航到首页
                    // navigate('/home');

                    // 显示成功提示
                    alert(`${isLogin ? '登录' : '注册'}成功，欢迎回来！`);
                } else {
                    // 处理接口返回的业务错误
                    setServerError(response.data.message || '操作失败，请重试');
                }
            } catch (error) {
                // 处理网络错误和服务器错误
                console.error(`${isLogin ? '登录' : '注册'}请求失败：`, error);

                if (error.response) {
                    // 服务器返回错误状态码
                    setServerError(
                        error.response.data?.message ||
                        `服务器错误 (${error.response.status})`
                    );
                } else if (error.request) {
                    // 无响应
                    setServerError('网络错误，无法连接到服务器');
                } else {
                    // 其他错误
                    setServerError('请求失败，请稍后重试');
                }
            } finally {
                setIsLoading(false); // 结束加载
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                    {isLogin ? '登录' : '注册'}
                </h1>

                {/* 服务器错误提示 */}
                {serverError && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 用户名输入 */}
                    <div className="space-y-2">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            用户名
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.username
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                            } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                                isLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm">{errors.username}</p>
                        )}
                    </div>

                    {/* 密码输入 */}
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            密码
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.password
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                            } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                                isLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password}</p>
                        )}
                    </div>

                    {/* 确认密码（仅注册） */}
                    {!isLogin && (
                        <div className="space-y-2">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                确认密码
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={`w-full px-4 py-2 rounded-lg border ${
                                    errors.confirmPassword
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                            )}
                        </div>
                    )}

                    {/* 提交按钮 */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                处理中...
                            </span>
                        ) : (
                            isLogin ? '登录' : '注册'
                        )}
                    </button>
                </form>

                {/* 切换模式链接 */}
                <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
                    {isLogin ? '还没有账号？' : '已有账号？'}
                    <button
                        type="button"
                        onClick={toggleMode}
                        disabled={isLoading}
                        className="cursor-pointer ml-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLogin ? '立即注册' : '立即登录'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default App;