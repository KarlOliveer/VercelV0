import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectList } from "./components/projects/project-list"
import { StockManagement } from "./components/stock/stock-management"
import { TestProcedures } from "./components/tests/test-procedures"

export default function DashboardPage() {
  return (
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="stock">Estoque</TabsTrigger>
            <TabsTrigger value="tests">Testes</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="space-y-4">
            <ProjectList />
          </TabsContent>
          <TabsContent value="stock" className="space-y-4">
            <StockManagement />
          </TabsContent>
          <TabsContent value="tests" className="space-y-4">
            <TestProcedures />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

