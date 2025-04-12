import React from 'react';
import {useForm} from 'react-hook-form';
import {useAuthStore} from "../store/authStore.js";
import { FiX } from "react-icons/fi";
import "../styles/components/LoginForm.scss"

const LoginForm = ({handleModalClose}) => {

    const {
        login,
        isLoading,
        error
    } = useAuthStore();

    const {
        register,
        formState: {errors},
        handleSubmit,
        watch
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            login: "",
            password: "",
        }
    })

    const onSubmit = async (values) => {
        const success = await login(
            values.login, values.password,
        );
        if (success === true) {
            handleModalClose();
        } else {
            console.log(success.error)
        }
    }

    const loginValue = watch("login");
    const passwordValue = watch("password");

    return (
        <div className="form-overlay" onClick={handleModalClose}>
            <div className="form-body" onClick={event => event.stopPropagation()}>
                <button className="close-btn" onClick={handleModalClose}>
                    <FiX />
                </button>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="login">
                            Логин:
                        </label>
                        <div className="input-wrapper">
                            <input
                                id="login"
                                className={loginValue && errors.login ? "error" : ""}
                                {
                                    ...register("login", {
                                        required: "Обязательное поле"
                                    })
                                }
                            />
                            <div className="error-container">
                                {errors.login && (
                                    <span className="error-message">{errors.login.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Пароль:
                        </label>
                        <div className="input-wrapper">
                            <input
                                id="password"
                                type="password"
                                className={passwordValue && errors.password ? "error" : ""}
                                {
                                    ...register("password", {
                                        required: "Обязательное поле"
                                    })
                                }
                            />
                            <div className="error-container">
                                {errors.password && (
                                    <span className="error-message">{errors.password.message}</span>
                                )}
                                {error && <span className="error-message">{error}</span>}
                            </div>
                        </div>
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`submit-btn ${isLoading ? 'loading' : ''}`}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;