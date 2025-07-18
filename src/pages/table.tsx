import { useQuery } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Label } from "@radix-ui/react-label"
import { PiggyBank, Search, Settings, Landmark } from "lucide-react"
import { columns } from './table/columns'
import { DataTable } from './table/data-table'
import React from 'react'
const estados = Array.from({ length: 5 }, (_, i) => `Estado ${i + 1}`)

export default function FilledCards() {
  const { data: rawInvoices = [], isLoading, isError } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const res = await fetch('/invoices.json')
      if (!res.ok) throw new Error('Error al cargar los datos')
      return res.json()
    },
  })

const invoices = React.useMemo(() => {
  return rawInvoices.map((item: any) => {
    const originalValue = item.montoCredito
    const montoStr =
      typeof originalValue === "string"
        ? originalValue
        : originalValue !== null && originalValue !== undefined
        ? String(originalValue)
        : ""

    const montoLimpio = montoStr.replace(/[^0-9.]/g, "")
    const montoNumerico = parseFloat(montoLimpio)

    return {
      ...item,
      amount: !isNaN(montoNumerico) ? montoNumerico : 0, // <---- Aquí cambio el nombre
    }
  })
}, [rawInvoices])

  

  return (
    <div className="w-full px-2">
      <div className="grid grid-cols-2 gap-4 bg-muted text-muted-foreground p-4 shadow border mt-8">
        <Input
          type="text"
          placeholder="Ingrese su búsqueda"
          className="border border-border rounded-md"
        />
        <div className="grid grid-cols-3 gap-4 col-end-7">
          <Button variant="outline" size="icon" className="border border-border">
            <PiggyBank className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="border border-border">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="border border-border">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-muted text-muted-foreground p-4 shadow border mt-8">
        <div className="grid grid-cols-2">
          {[1, 2].map((i) => (
            <Select key={i}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`Seleccione Estado ${i}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
                  {estados.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccione Estado 3" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Estados</SelectLabel>
                {estados.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Label className="border border-border h-10 w-10 flex items-center justify-center">
            <Landmark className="h-5 w-5" />
          </Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccione Estado 4" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Estados</SelectLabel>
                {estados.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-20 pl-6">
        <h1 className="text-left font-bold text-xl">Estados de Cuenta</h1>
      </div>

      <div className="mt-20">
        {isLoading ? (
          <p className="text-center">Cargando...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Error al cargar los datos</p>
        ) : (
          <DataTable columns={columns} data={invoices} />
        )}
      </div>
    </div>
  )
}
