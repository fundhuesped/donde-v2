import {signIn, signOut} from 'next-auth/react';
import {NextPage} from 'next';
import MainContainer from '../components/MainContainer';
import {FormEvent, useState} from 'react';
import {useAuthenticatedUser} from "../hooks/useAuthenticatedUser";

const SignIn: NextPage = () => {
  const user = useAuthenticatedUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    });
    if (res?.error && res?.status === 401) {
      setError('Contraseña incorrecta')
    }
  };

  return (
    <MainContainer className={'mt-6 pt-8'}>
      {user && `Hola ${user.firstName} ${user.lastName}!`}
      <h1 className="text-xl font-bold mb-4">Ingresar</h1>
      <form className={'mt-10'} onSubmit={handleSignIn}>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            required
            value={email}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
        {user && (
          <button
            onClick={() => signOut()}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign out
          </button>
        )}
        {error && <p>{error}</p>}
      </form>
    </MainContainer>
  );
};

export default SignIn;
