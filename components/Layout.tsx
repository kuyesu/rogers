import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import Modal from 'react-modal';
import { fb } from '../firebase/functions';
import { useRouter } from 'next/router';
import { Sidebar, CreateProjectModal, Header, SidebarOverlay } from './';
import { useSize } from '../hooks';
import { DropResult } from 'react-beautiful-dnd';
import dynamic from 'next/dynamic';
import { Project, TodoAppContext } from '../pages/_app';

Modal.setAppElement('#__next');

interface LayoutProps {
  children: ReactElement[] | ReactElement | Text;
}

const ProjectsList = dynamic(() => import('../components/ProjectsList'), {
  ssr: false,
});

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const context = useContext(TodoAppContext);
  const [projectsList, setProjectsList] = useState(context.projects);
  const [сreateProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(true);

  const target = useRef(null);

  const { isOverlay, size } = useSize(target);
  const router = useRouter();

  const handleProjectCreation = async (values: any) => {
    try {
      const createdProject = await fb().createProject(values, context.user);
      setProjectsList([...projectsList, createdProject as Project]);
      router.push(`/project/${createdProject?.id}`);
      setCreateProjectModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const closeModal = () => {
    setCreateProjectModalOpen(false);
    setSettingsModalOpen(false);
  };

  const reorder = (list: Project[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (res: DropResult) => {
    if (!res.destination) return;

    const items = reorder(
      projectsList,
      res.source.index,
      res.destination.index
    );

    setProjectsList(items);
  };

  const handleSideberOpen = () => setSidebarMenuOpen(!sidebarMenuOpen);
  const handleSettingsModalOpen = () =>
    setSettingsModalOpen(!settingsModalOpen);

  useEffect(() => {
    const unsub = fb().getAllProjectsRealtime(context.user, setProjectsList);
  }, []);

  useEffect(() => {
    if (size?.width < 1024) setSidebarMenuOpen(true);
    else setSidebarMenuOpen(true);
  }, [size]);

  return (
    <div
      className="bg-slate-200 transition duration-200 dark:bg-slate-900  dark:text-white w-full h-screen p-2 md:p-8 lg:p-12"
      ref={target}
    >
      <div className="bg-white overflow-hidden transition duration-200 dark:bg-gray-800 w-full h-full rounded-xl shadow-md py-8">
        <Header
          handleSettingsModalOpen={handleSettingsModalOpen}
          handleSidebarOpen={handleSideberOpen}
        />
        <div className="flex px-4 sm:px-6 lg:px-8 h-[calc(100%-45px-32px)]">
          <AnimatePresence>
            {sidebarMenuOpen && (
              <Sidebar size={size}>
                {/* social icons */}
                <div className="flex justify-center items-center">
                  <a
                    href="https://github.com/kuyesu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 text-gray-600 hover:text-gray-800"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118" />
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com/kuyeso_rogers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 text-gray-600 hover:text-gray-800"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/kuyeso-rogers-040ab3198/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 text-gray-600 hover:text-gray-800"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </Sidebar>
            )}
          </AnimatePresence>
          <AnimateSharedLayout>
            <motion.div layout className="lg:pl-8 flex-1">
              <iframe
                src="https://docs.google.com/presentation/d/e/2PACX-1vTMTBIeSTlOWk4wcZayp5xUdQpliaNExhVD8dSyd4lVLAmH5cSLjCN_y3F6mmB_gR_RTLgZPM6gdAtq/embed?start=false&loop=false&delayms=60000"
                frameBorder="0"
                width="580"
                height="399"
              ></iframe>
            </motion.div>
          </AnimateSharedLayout>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Layout);
