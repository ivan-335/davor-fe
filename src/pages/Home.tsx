export default function Home() {
    return (
        <div className="shadow-lg rounded-xl p-8 justify-content text-center">
            <button
                onClick={async () => {
                    await fetch('http://localhost:4000/api/seed', { method: 'GET' });
                }}
                className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded"
            >
                Seed Mock Data
            </button>
        </div>
    );
}