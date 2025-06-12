
import { useParams, useSearchParams } from 'react-router-dom';
import CompanyLayout from '@/components/company/CompanyLayout';
import VehicleForm from '@/components/company/vehicles/VehicleForm';
import { useVehicleForm } from '@/hooks/vehicles/useVehicleForm';

const AddEditVehicle = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam || 'details';

  const {
    methods,
    isLoading,
    isSubmitting,
    images,
    setImages,
    onSubmit,
    isEditMode
  } = useVehicleForm(id);

  if (isLoading) {
    return (
      <CompanyLayout title={isEditMode ? "Edit Vehicle" : "Add New Vehicle"}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout title={isEditMode ? "Edit Vehicle" : "Add New Vehicle"}>
      <VehicleForm
        methods={methods}
        onSubmit={onSubmit}
        images={images}
        setImages={setImages}
        vehicleId={id}
        isEditMode={isEditMode}
        isSubmitting={isSubmitting}
      />
    </CompanyLayout>
  );
};

export default AddEditVehicle;
