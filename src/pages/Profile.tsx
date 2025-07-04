import React from 'react';
import { useProfileLogic } from '../hooks/useProfileLogic';
import { ProfilePhotoUploader } from '../components/ProfilePhotoUploader';
import { ProfileForm } from '../components/ProfileForm';

const Profile: React.FC = () => {
  const {
    user,
    loadingAuth,
    errorAuth,
    displayName,
    setDisplayName,
    lastName,
    setLastName,
    companyName,
    setCompanyName,
    taxId,
    setTaxId,
    address,
    setAddress,
    city,
    setCity,
    country,
    setCountry,
    photoURL,
    iban,
    setIban,
    defaultCurrency,
    setDefaultCurrency,
    defaultIVA,
    setDefaultIVA,
    defaultIRPF,
    setDefaultIRPF,
    selectedFile,
    loadingProfile,
    errorProfile,
    successMessage,
    uploadingPhoto,
    handleFileChange,
    handleUploadPhoto,
    handleUpdateProfile,
  } = useProfileLogic();

  if (loadingAuth || loadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (errorAuth) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        Error de autenticación: {errorAuth.message}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
        No hay usuario autenticado.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Mi Perfil
      </h1>
      <ProfilePhotoUploader
        photoURL={photoURL}
        handleFileChange={handleFileChange}
        handleUploadPhoto={handleUploadPhoto}
        selectedFile={selectedFile}
        uploadingPhoto={uploadingPhoto}
      />
      <p className="text-gray-700 mb-2 text-center">{user.email}</p>

      <ProfileForm
        displayName={displayName}
        setDisplayName={setDisplayName}
        lastName={lastName}
        setLastName={setLastName}
        companyName={companyName}
        setCompanyName={setCompanyName}
        taxId={taxId}
        setTaxId={setTaxId}
        address={address}
        setAddress={setAddress}
        city={city}
        setCity={setCity}
        country={country}
        setCountry={setCountry}
        iban={iban}
        setIban={setIban}
        defaultCurrency={defaultCurrency}
        setDefaultCurrency={setDefaultCurrency}
        defaultIVA={defaultIVA}
        setDefaultIVA={setDefaultIVA}
        defaultIRPF={defaultIRPF}
        setDefaultIRPF={setDefaultIRPF}
        handleUpdateProfile={handleUpdateProfile}
        loadingProfile={loadingProfile}
        errorProfile={errorProfile}
        successMessage={successMessage}
      />
    </div>
  );
};

export default Profile;
