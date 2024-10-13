import ShortenForm from '../components/ShortenForm';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="bg-indigo-600 text-white">
                    <CardTitle className="text-4xl font-bold">URL Shortener</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <CardDescription className="mb-4 text-gray-700">
                        Easily shorten your URLs and track their usage.
                    </CardDescription>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700">
                                Original URL
                            </label>
                            <Input
                                type="url"
                                id="originalUrl"
                                name="originalUrl"
                                className="mt-1 block w-full"
                                placeholder="Enter the original URL"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700">
                                Custom Slug (optional)
                            </label>
                            <Input
                                type="text"
                                id="customSlug"
                                name="customSlug"
                                className="mt-1 block w-full"
                                placeholder="Enter a custom slug"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md"
                        >
                            Shorten URL
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}