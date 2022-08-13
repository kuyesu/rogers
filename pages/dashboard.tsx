// import App from "next/app";
// import type { AppContext, AppProps } from "next/app";
// import { getSession, SessionProvider } from "next-auth/react";
// import Layout from "../components/Layout";
// import { fb } from "../firebase/functions";
// import { createContext } from "react";

// // 1. import `NextUIProvider` component
// import { NextUIProvider } from "@nextui-org/react";

// export type Project = {
//   id: string;
//   name: string;
//   color: string;
// };
// export type User = {
//   email: string;
//   emailVerified: null | string;
//   id: string;
//   image: string;
//   name: string;
// };

// interface TodoAppProps extends AppProps {
//   projects: Project[];
//   user: User;
// }

// interface TodoAppContextInterface {
//   projects: Project[];
//   user: User;
// }

// export const TodoAppContext = createContext<TodoAppContextInterface>({
//   projects: [],
//   user: {
//     email: "",
//     emailVerified: null,
//     id: "",
//     image: "",
//     name: "",
//   },
// });

// export default function TodoApp({
//   Component,
//   pageProps: { session, ...pageProps },
//   projects,
//   user,
// }: TodoAppProps) {
//   return (
//     <SessionProvider session={session}>
//       <TodoAppContext.Provider value={{ projects, user }}>
//         <Layout>
//           <NextUIProvider>
//             <Component {...pageProps} />
//           </NextUIProvider>
//         </Layout>
//       </TodoAppContext.Provider>
//     </SessionProvider>
//   );
// }

// TodoApp.getInitialProps = async (appContext: AppContext) => {
//   const appProps = await App.getInitialProps(appContext);
//   const session = await getSession(appContext.ctx);
//   const user = await fb().getUserByEmail(session?.user?.email as string);
//   const projects = await fb().getAllProjects(user);

//   return { ...appProps, projects, user };
// };
