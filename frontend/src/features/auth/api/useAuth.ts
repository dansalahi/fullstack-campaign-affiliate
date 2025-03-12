import { useMutation } from "@tanstack/react-query";
import { signUp, signIn } from "./authApi";

// Sign Up Hook
export const useSignUp = () => {
	return useMutation({
		mutationFn: signUp,
	});
};

// Sign In Hook
export const useSignIn = () => {
	return useMutation({
		mutationFn: signIn,
		onSuccess: (data) => {
			localStorage.setItem("user", JSON.stringify(data));
		},
	});
};
