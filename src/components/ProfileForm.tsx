import React from 'react';

interface ProfileFormProps {
  userName: string;
  setUserName: (value: string) => void;
  userLastName: string;
  setUserLastName: (value: string) => void;
  companyName: string;
  setCompanyName: (value: string) => void;
  taxId: string;
  setTaxId: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  iban: string;
  setIban: (value: string) => void;
  defaultCurrency: string;
  setDefaultCurrency: (value: string) => void;
  defaultIVA: number;
  setDefaultIVA: (value: number) => void;
  defaultIRPF: number;
  setDefaultIRPF: (value: number) => void;
  handleUpdateProfile: (e: React.FormEvent) => Promise<void>;
  loadingProfile: boolean;
  errorProfile: string | null;
  successMessage: string | null;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  userName,
  setUserName,
  userLastName,
  setUserLastName,
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
  iban,
  setIban,
  defaultCurrency,
  setDefaultCurrency,
  defaultIVA,
  setDefaultIVA,
  defaultIRPF,
  setDefaultIRPF,
  handleUpdateProfile,
  loadingProfile,
  errorProfile,
  successMessage,
}) => {
  return (
    <form onSubmit={handleUpdateProfile} className="space-y-4">
      <div>
        <label htmlFor="displayName" className="block text-gray-700 text-sm font-bold mb-2">
          Nombre de Usuario
        </label>
        <input
          type="text"
          id="displayName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="userLastName" className="block text-gray-700 text-sm font-bold mb-2">
          Apellidos
        </label>
        <input
          type="text"
          id="userLastName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={userLastName}
          onChange={(e) => setUserLastName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="companyName" className="block text-gray-700 text-sm font-bold mb-2">
          Nombre de la Empresa
        </label>
        <input
          type="text"
          id="companyName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="taxId" className="block text-gray-700 text-sm font-bold mb-2">
          NIF/CIF
        </label>
        <input
          type="text"
          id="taxId"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
          Dirección
        </label>
        <input
          type="text"
          id="address"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
          Ciudad
        </label>
        <input
          type="text"
          id="city"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">
          País
        </label>
        <input
          type="text"
          id="country"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="iban" className="block text-gray-700 text-sm font-bold mb-2">
          IBAN
        </label>
        <input
          type="text"
          id="iban"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={iban}
          onChange={(e) => setIban(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="defaultCurrency" className="block text-gray-700 text-sm font-bold mb-2">
          Moneda por Defecto
        </label>
        <input
          type="text"
          id="defaultCurrency"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={defaultCurrency}
          onChange={(e) => setDefaultCurrency(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="defaultIVA" className="block text-gray-700 text-sm font-bold mb-2">
          IVA por Defecto (%)
        </label>
        <input
          type="number"
          id="defaultIVA"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={defaultIVA}
          onChange={(e) => setDefaultIVA(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="defaultIRPF" className="block text-gray-700 text-sm font-bold mb-2">
          IRPF por Defecto (%)
        </label>
        <input
          type="number"
          id="defaultIRPF"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={defaultIRPF}
          onChange={(e) => setDefaultIRPF(parseFloat(e.target.value))}
        />
      </div>

      {errorProfile && <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md mt-4">{errorProfile}</div>}
      {successMessage && <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md mt-4">{successMessage}</div>}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-6"
        disabled={loadingProfile}
      >
        {loadingProfile ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Actualizando...
          </div>
        ) : (
          'Actualizar Perfil'
        )}
      </button>
    </form>
  );
};
