"use client";
import { useState } from "react";
import { useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";


const queryClient = new QueryClient();

function SignupForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  let router = useRouter();

  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      return response.json();
    },onSuccess:(()=>{
router.push("/Login")
    }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
<div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">
      Sign up for an account
    </h2>
  </div>
  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900">
          Email address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="block w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900">
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          className="block w-full rounded-md border border-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
      >
        {mutation.isPending ? "Signing up..." : "Sign Up"}
      </button>
    </form>
    {mutation.isError && <p className="text-red-500 mt-2">{mutation.error.message}</p>}
    {mutation.isSuccess && <p className="text-green-500 mt-2">Signup successful!</p>}
  </div>
</div>

  );
}

export default function Signup() {
  return (
    <QueryClientProvider client={queryClient}>
      <SignupForm />
    </QueryClientProvider>
  );
}
