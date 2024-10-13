import ShortenForm from '../components/ShortenForm';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-6">URL Shortener</h1>
            <ShortenForm />
        </div>
    );
}
