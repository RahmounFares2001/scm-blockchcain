"use client";

// icons 
import { FiRefreshCcw } from "react-icons/fi";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// hooks
import useGetAllMaterials from "@/app/hooks/suppliers/useGetAllMaterials";

export function RawMaterialsTable() {
    // Get materials data
    const { materials, loading, error, fetchMaterials } = useGetAllMaterials();
    
    // Format materials data
    const data = materials.map((material) => ({
        id: material.id.toString(),
        name: material.name,
        description: material.description,
        price: material.price,
        quantityAvailable: material.quantityAvailable,
        isAvailable: material.isAvailable ? "Available" : "Not Available",
        timestamp: new Date(material.timestamp * 1000).toLocaleString(),
    }));

    return (
        <>
            <div className="w-full flex">
                <button
                    className="px-6 py-1 bg-primary text-gray-100 rounded-md hover:bg-primary/90 flex justify-center items-center gap-3"
                    onClick={fetchMaterials} 
                >
                    Refresh Materials
                    <FiRefreshCcw />
                </button>
            </div>

            {/* Loading State */}
            {loading && <h1>Loading...</h1>}

            {/* Error State */}
            {error && <h1 className="text-red-500">{error}</h1>}

            {/* Table */}
            {!loading && !error && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Price (USD)</TableHead>
                            <TableHead>Quantity Available</TableHead>
                            <TableHead>Availability</TableHead>
                            <TableHead>Last Updated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>${item.price}</TableCell> 
                                <TableCell>{item.quantityAvailable}</TableCell>
                                <TableCell
                                    className={`${item.isAvailable === "Available" ? "text-green-700" : "text-red-700"} font-bold`}
                                >
                                    {item.isAvailable}
                                </TableCell>
                                <TableCell>{item.timestamp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={7}>Page 1/1</TableCell> 
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </>
    );
}