import type { FC } from 'react';
import { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Status, type Project } from '../types/Project';
import type { User } from '../types/User';

interface ProjectModalProps {
    initialData?: Project | null;
    onSave: (payload: {
        id: string;
        title: string;
        description?: string;
        status: Status;
        deadline?: Date;
        user: User | null;
        budget: string;
    }) => void;
    onClose: () => void;
}
const STATUSES: { label: string; value: Status }[] = [
    { label: 'Active', value: Status.Active },
    { label: 'On Hold', value: Status.OnHold },
    { label: 'In Progress', value: Status.InProgress },
    { label: 'Completed', value: Status.Completed },
];
const ProjectModal: FC<ProjectModalProps> = ({ initialData, onSave, onClose }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [status, setStatus] = useState<Status>(initialData?.status || 1);
    const [deadline, setDeadline] = useState<Date | null>(
        initialData?.deadline ? new Date(initialData.deadline) : null
    );
    const [budget, setBudget] = useState(initialData?.budget || '');
    const [userId, setUserId] = useState<string>(initialData?.user?._id ?? '');
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch('http://localhost:4000/api/users')
            .then(res => res.json())
            .then((data: User[]) => setUsers(data))
            .catch(console.error);
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || '');
            setStatus(initialData.status);
            setDeadline(initialData.deadline ? new Date(initialData.deadline) : null);
            setBudget(initialData.budget);
        } else {
            setTitle('');
            setDescription('');
            setStatus(Status.OnHold);
            setDeadline(null);
            setBudget('');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            id: initialData?._id ?? '',
            title: title.trim(),
            description: description.trim(),
            status,
            deadline: deadline ?? undefined,
            budget,
            user: users.find(user => user._id === userId) || null,
        }
        onSave(payload);
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl text-gray-500 font-semibold mb-4">
                    {initialData ? 'Edit Project' : 'New Project'}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-500 text-sm font-medium mb-1" htmlFor="project-title">
                            Title<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="project-title"
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-black rounded text-gray-600 px-3 py-2 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 font-medium mb-1" htmlFor="Project-desc">
                            Description*
                        </label>
                        <textarea
                            id="Project-desc"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-black text-gray-600 rounded px-3 py-2 focus:outline-none focus:ring"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-500 text-sm font-medium mb-1" htmlFor="project-status">
                                Status
                            </label>
                            <select
                                id="project-status"
                                value={status}
                                onChange={(e) => setStatus(Number(e.target.value) as Status)}
                                className="w-full border border-black text-gray-600 rounded px-3 py-2 focus:outline-none focus:ring"
                            >
                                {STATUSES.map(({ label, value }) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Owner</label>
                        <select
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">— Select owner —</option>
                            {Array.isArray(users) && users.map(u => (
                                <option key={u._id} value={u._id}>
                                    {u.email}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 font-medium mb-1" htmlFor="project-deadline">
                            Deadline
                        </label>
                        <ReactDatePicker
                            id="project-deadline"
                            selected={deadline}
                            onChange={(date) => setDeadline(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select a date"
                            className="w-full border border-black text-gray-600 rounded px-3 py-2 focus:outline-none focus:ring"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-500 text-sm font-medium mb-1" htmlFor="project-budget">
                            Budget<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="project-budget"
                            type="text"
                            required
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="w-full border border-black text-gray-600 rounded px-3 py-2 focus:outline-none focus:ring"
                        />
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-black text-gray-500 rounded hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            {initialData ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
