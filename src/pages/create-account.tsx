import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import nuberLogo from "../images/logo.svg";
import { createAccountMutation, createAccountMutationVariables } from "../__generated__/createAccountMutation";
import { UserRole } from "../__generated__/globalTypes";

const CREATE_ACCOUNT_MUTATION = gql`
   mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
     createAccount(input: $createAccountInput) {
       ok
       error
     }
   }
 `;

interface ICreateAccountForm {
    email: string;
    password: string;
    role: UserRole;

}

export const CreateAccount = () => {
    const {
        register, getValues, formState: { errors }, handleSubmit, formState, watch
    } = useForm<ICreateAccountForm>({
        mode: "onChange",
        defaultValues: {
            role: UserRole.Client,
        }
    });

    const history = useNavigate();
    const [createAccountMutation, { loading, data: createAccountMutationResult }] = useMutation<createAccountMutation, createAccountMutationVariables>(CREATE_ACCOUNT_MUTATION);
    const onCompleted = (data: createAccountMutation) => {
        const {
            createAccount: { ok }
        } = data;
        if (ok) {
            alert("Account Created! Log in now!")
            history("/");
        }
    }
    const onSubmit = () => {
        if (!loading) {
            const { email, password, role } = getValues();
            createAccountMutation({
                variables: {
                    createAccountInput: { email, password, role },
                }
            })
        }
    };
    console.log(watch());
    return (
        <div className="h-screen flex flex-col items-center mt-10 lg:mt-28">
            <Helmet>
                <title>Create Account | Nuber Eats</title>
            </Helmet>
            <div className="w-full max-w-screen-sm flex flex-col px-5 items-center ">
                <img src={nuberLogo} className="w-52 mb-10" alt="Nuber Eats"></img>
                <h4 className="text-left font-medium w-full text-3xl mb-5">Let's get started</h4>
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

                    <select  {...register("role", { required: true })} className='input'>
                        {Object.keys(UserRole).map((role, index) => <option key={index}>{role}</option>)}
                    </select>
                    <Button canClick={formState.isValid} loading={loading} actionText={"Log in"} />
                    {createAccountMutationResult?.createAccount.error && <FormError errorMessage={createAccountMutationResult.createAccount.error} />}
                </form>
                <div>
                    Already have an account? <Link to="/" className=" text-lime-600 hover:underline">Log in now</Link>
                </div>
            </div>
        </div>

    )
}