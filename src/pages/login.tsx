import React from 'react';
import { Helmet } from 'react-helmet-async';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import { loginMutation, loginMutationVariables } from '../__generated__/loginMutation';
import nuberLogo from "../images/logo.svg";
import { Button } from '../components/button';
import { Link } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';


const LOGIN_MUTATION = gql`
    mutation loginMutation($loginInput: LoginInput! ){ 
        login(input:$loginInput){
            ok
            token
            error
        }
    }
`


interface ILoginForm {
    email: string;
    password: string;
}

export const Login = () => {
    const { register, getValues, formState: { errors }, handleSubmit, formState } = useForm<ILoginForm>({ mode: "onChange" });

    const onCompleted = (data: loginMutation) => {
        if (data.login.ok) {
            const { login: { ok, token } } = data;

            if (ok && token) {

                localStorage.setItem(LOCALSTORAGE_TOKEN, token);
                authTokenVar(token);
                isLoggedInVar(true);
            }
        }
    }
    //loginMutation 위에 import 랑 상관 없음
    const [loginMutation, { data: loginMutationResult, loading }] = useMutation<loginMutation, loginMutationVariables>(LOGIN_MUTATION, {
        onCompleted,
    });

    const onSubmit = () => {
        if (!loading) {
            const { email, password } = getValues();
            loginMutation({
                variables: {
                    loginInput: {
                        email,
                        password
                    }
                }
            })
        }
    };

    return (
        <div className="h-screen flex flex-col items-center mt-10 lg:mt-28">
            <Helmet>
                <title>Login | Nuber Eats</title>
            </Helmet>
            <div className="w-full max-w-screen-sm flex flex-col px-5 items-center ">
                <img src={nuberLogo} className="w-52 mb-10" alt="Nuber Eats"></img>
                <h4 className="text-left font-medium w-full text-3xl mb-5">Welcomme back</h4>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 w-full mb-5">
                    <input
                        type="email"
                        {...register("email", { required: "Email is required", pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })}
                        required
                        placeholder='Email'
                        className="input " />
                    {errors.email?.message && (<FormError errorMessage={errors.email?.message} />)}
                    {errors.email?.type === 'pattern' && (<FormError errorMessage={"Please enter a valid email"} />)}
                    <input
                        type="password"
                        {...register("password", { required: "Email is required", minLength: 10 })}
                        required
                        placeholder='Password'
                        className="input" />
                    {errors.password?.message && (<FormError errorMessage={errors.password?.message} />)}
                    {errors.password?.type === "minLength" && (<FormError errorMessage="Password must be mmore than 10 chars" />)}
                    <Button canClick={formState.isValid} loading={loading} actionText={"Log in"} />
                    {loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
                </form>
                <div>
                    New to Nuber? <Link to="/create-account" className=" text-lime-600 hover:underline">Create an Account</Link>
                </div>
            </div>
        </div>

    )
}