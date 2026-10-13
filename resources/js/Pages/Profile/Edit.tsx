import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AdminLayout title="Profile">
            <Head title="Profile" />

            <div className="space-y-6">
                <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                </div>

                <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <UpdatePasswordForm />
                </div>

                <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <DeleteUserForm />
                </div>
            </div>
        </AdminLayout>
    );
}
