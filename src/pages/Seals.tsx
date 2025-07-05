import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus } from 'react-icons/fa';

import { useSealsLogic } from '../hooks/useSealsLogic';
import useMediaQuery from '../hooks/useMediaQuery';
import SealFormModal from '../components/SealFormModal';
import SealFormSidebar from '../components/SealFormSidebar';
import { SealCard } from '../components/SealCard';
import { SealDetailModal } from '../components/SealDetailModal';

const Seals: React.FC = () => {
  const {
    user,
    loading,
    seals,
    editingSeal,
    isFormVisible,
    userProfile,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleFormSubmit,
    handleCancel,
    loadingMore,
    hasMore,
    selectedSealIdForView,
    showSealDetailModal,
    handleViewSeal,
    handleCloseSealDetailModal,
  } = useSealsLogic();

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>;
  }

  if (!user) {
    return <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">Debes iniciar sesión para gestionar tus sellos.</div>;
  }

  const formProps = {
    onCancel: handleCancel,
    onSubmit: handleFormSubmit,
    editingSeal,
    userProfile,
    user,
  };

  return (
    <>
      <div className="container mx-auto p-4 overflow-x-hidden">
        <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Sellos</h1>

        <div className="mb-4 flex justify-end">
          <button
            onClick={handleAddNew}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
          >
            <FaPlus className="mr-2" /> Crear Nuevo Sello
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className={`transition-all duration-300 ${isDesktop && isFormVisible ? 'lg:w-2/3' : 'w-full'}`}>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Mis Sellos</h2>
              {seals.length === 0 ? (
                <p className="text-gray-600">No tienes sellos creados aún.</p>
              ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {seals.map((seal) => (
                    <SealCard
                      key={seal.id}
                      seal={seal}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={(s) => handleViewSeal(s.id)}
                    />
                  ))}
                </div>
              )}
              {loadingMore && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              )}
              {!hasMore && seals.length > 0 && (
                <p className="text-center text-gray-500 mt-4">No hay más sellos para cargar.</p>
              )}
            </div>
          </div>

          {isFormVisible && (
            isDesktop ? (
              <div className="w-full lg:w-1/3 transition-all duration-300">
                <SealFormSidebar {...formProps} />
              </div>
            ) : (
              <SealFormModal showModal={isFormVisible} {...formProps} />
            )
          )}
        </div>
      </div>

      <SealDetailModal
        sealId={selectedSealIdForView}
        showModal={showSealDetailModal}
        onClose={handleCloseSealDetailModal}
      />
    </>
  );
};

export default Seals;

