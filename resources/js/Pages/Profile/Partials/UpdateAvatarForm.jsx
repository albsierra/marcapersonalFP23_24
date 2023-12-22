import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UpdateAvatarForm({ className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        avatar: '',
      })

    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        axios.get(route('user.getAvatar', { id: user.id }))
            .then(response => {
                setAvatarUrl(response.data.avatarUrl);
            });
    }, [user.id]);

    const submit = (e) => {
        e.preventDefault();
        post(route('user.postAvatar', { id: user.id }));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Avatar</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your avatar's profile.
                </p>
                <div>
                    <img src={avatarUrl} alt="Avatar" />
                </div>
            </header>
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="avatar" value="Avatar" />

                    <TextInput
                        id="avatar"
                        type="file"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('avatar', e.target.files[0])}
                    />

                    <InputError className="mt-2" message={errors.avatar} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
