'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from './table';
import { Input } from './input';
import { Button } from './button';
import { Copy, ExternalLink, ArrowUpDown, QrCode, Settings } from 'lucide-react';
import { formatDateTime, formatDate, isExpired } from '@/lib/utils';
import { Dialog, DialogTrigger } from './dialog';

interface TableProps {
    data: Array<{
        id: string;
        slug: string;
        originalUrl: string;
        visitCount: number;
        createdAt: Date;
        expirationDate: Date | null;
        shortenedUrl: string;
        isPasswordProtected?: boolean;
    }>;
    onCopy: (url: string) => void;
    onSort: (key: keyof TableProps['data'][0]) => void;
    onSelect: (url: TableProps['data'][0]) => void;
}

const DataTable: React.FC<TableProps> = ({ data, onCopy, onSort, onSelect }) => {
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = async (url: string) => {
        onCopy(url);
        setCopied(url);
        setTimeout(() => setCopied(null), 2000);
    };

    const filteredData = data.filter(item =>
        item.slug.toLowerCase().includes(search.toLowerCase()) ||
        item.originalUrl.toLowerCase().includes(search.toLowerCase())
    );

    const renderSortButton = (label: string, key: keyof TableProps['data'][0]) => (
        <Button
            variant="ghost"
            onClick={() => onSort(key)}
            className="flex items-center space-x-1 hover:bg-secondary/20"
        >
            <span>{label}</span>
            <ArrowUpDown className="h-4 w-4" />
        </Button>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Search URLs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{renderSortButton('Slug', 'slug')}</TableHead>
                            <TableHead>{renderSortButton('Original URL', 'originalUrl')}</TableHead>
                            <TableHead>{renderSortButton('Visits', 'visitCount')}</TableHead>
                            <TableHead>{renderSortButton('Created', 'createdAt')}</TableHead>
                            <TableHead>{renderSortButton('Expires', 'expirationDate')}</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.slug}</TableCell>
                                <TableCell className="max-w-[300px] truncate">
                                    <a
                                        href={item.originalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline flex items-center"
                                    >
                                        {item.originalUrl}
                                        <ExternalLink className="ml-1 h-4 w-4" />
                                    </a>
                                </TableCell>
                                <TableCell>{item.visitCount}</TableCell>
                                <TableCell>{formatDateTime(item.createdAt)}</TableCell>
                                <TableCell>
                                    {item.expirationDate && (
                                        <span className={isExpired(item.expirationDate) ? 'text-destructive' : ''}>
                                            {formatDate(item.expirationDate)}
                                        </span>
                                    ) || 'Never'}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleCopy(item.shortenedUrl)}
                                            className={copied === item.shortenedUrl ? 'text-green-500' : ''}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <a
                                            href={item.shortenedUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onSelect(item)}
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                        </Dialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DataTable;