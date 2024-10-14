import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from './table';

interface TableProps {
    data: Array<{ slug: string; originalUrl: string; visitCount: string; createdAt: string; expirationDate: string }>;
}

const DataTable: React.FC<TableProps> = ({ data }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Slug</TableHead>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Visit Count</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Expiration Date</TableHead>

                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.slug}>
                        <TableCell>{item.slug}</TableCell>
                        <TableCell>{item.originalUrl}</TableCell>
                        <TableCell>{item.visitCount}</TableCell>
                        <TableCell>{item.createdAt}</TableCell>
                        <TableCell>{item.expirationDate}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default DataTable;