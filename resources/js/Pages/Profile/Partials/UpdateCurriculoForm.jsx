import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import React, { useEffect, useState } from 'react';

export default function UpdateCurriculumForm({ className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        pdf_curriculum: '',
        video_curriculum: '',
    });

    const [curriculoData, setCurriculoData] = useState('');

    useEffect(() => {
        axios.get(route('profile.getCurriculo', { id: user.id }))
            .then(response => {
                setCurriculoData(response.data);
            });
    }, [user.id]);

    const submit = (e) => {
        e.preventDefault();

        post(route('profile.postCurriculo', { id: user.id }));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Currículo</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Actualiza la información de tu Currículo
                </p>
                <div>
                    <p className="text-sm mt-2 text-gray-800">
                        <a
                            href={(curriculoData && curriculoData.curriculoUrl)
                                    ?? curriculoData.curriculoUrl}
                            download={(curriculoData && curriculoData.curriculoUrl)
                                    ?? curriculoData.curriculoUrl}
                        >
                            Click here to download your curriculum.
                        </a>
                    </p>
                </div>
            </header>
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="avatar" value="Avatar" />

                    <TextInput
                        id="pdf_curriculum"
                        type="file"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('pdf_curriculum', e.target.files[0])}
                    />

                    <InputError className="mt-2" message={errors.pdf_curriculum} />
                </div>
                <div>
                    <InputLabel htmlFor="video_curriculum" value="Video Currículo" />

                    <TextInput
                        id="video_curriculum"
                        className="mt-1 block w-full"
                        value={data.video_curriculum}
                        onChange={(e) => setData('video_curriculum', e.target.value)}
                        required
                        isFocused
                        autoComplete="video_curriculum"
                    />

                    <InputError className="mt-2" message={errors.video_curriculum} />
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
