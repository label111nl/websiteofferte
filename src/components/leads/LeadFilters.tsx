import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Filter, 
  SortAsc, 
  SortDesc, 
  Search,
  Euro,
  Calendar,
  MapPin,
  Tags,
  Building
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface LeadFiltersProps {
  onFilterChange: (filters: any) => void
  onSortChange: (sort: any) => void
}

const TECHNOLOGIES = [
  'WordPress',
  'WooCommerce',
  'Laravel',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'PHP',
  'Python',
  'Custom CMS'
]

const INDUSTRIES = [
  'E-commerce',
  'Healthcare',
  'Education',
  'Finance',
  'Real Estate',
  'Technology',
  'Manufacturing',
  'Retail',
  'Services',
  'Other'
]

export function LeadFilters({ onFilterChange, onSortChange }: LeadFiltersProps) {
  const [filters, setFilters] = useState({
    budget_min: '',
    budget_max: '',
    timeline: '',
    search: '',
    location: '',
    technologies: [] as string[],
    industry: '',
    project_size: [0, 100000] as [number, number],
    has_requirements: false,
    has_design: false
  })

  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'created_at',
    direction: 'desc'
  })

  // Get unique timelines for filter options
  const { data: timelines } = useQuery({
    queryKey: ['lead-timelines'],
    queryFn: async () => {
      const { data } = await supabase.rpc('get_distinct_timelines')
      return (data as string[]) || []
    }
  })

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSortChange = (field: string) => {
    const newSort = {
      field,
      direction: sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc'
    } as const;
    setSort(newSort);
    onSortChange(newSort);
  }

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search leads..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="max-w-sm"
          leftIcon={<Search className="w-4 h-4" />}
        />
        
        <Select
          value={sort.field}
          onValueChange={(value: string) => handleSortChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Date</SelectItem>
            <SelectItem value="budget_range">Budget</SelectItem>
            <SelectItem value="timeline">Timeline</SelectItem>
            <SelectItem value="project_size">Project Size</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleSortChange(sort.field)}
        >
          {sort.direction === 'desc' ? (
            <SortDesc className="w-4 h-4" />
          ) : (
            <SortAsc className="w-4 h-4" />
          )}
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px]">
            <SheetHeader>
              <SheetTitle>Advanced Filters</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 py-4">
              {/* Budget Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget Range</label>
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.budget_min}
                    onChange={(e) => handleFilterChange('budget_min', e.target.value)}
                    className="w-24"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.budget_max}
                    onChange={(e) => handleFilterChange('budget_max', e.target.value)}
                    className="w-24"
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Timeline</label>
                <Select
                  value={filters.timeline}
                  onValueChange={(value: string) => handleFilterChange('timeline', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelines?.map((timeline) => (
                      <SelectItem key={timeline} value={timeline}>
                        {timeline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Technologies</label>
                <div className="grid grid-cols-2 gap-2">
                  {TECHNOLOGIES.map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.technologies.includes(tech)}
                        onCheckedChange={(checked: boolean) => {
                          const newTechs = checked
                            ? [...filters.technologies, tech]
                            : filters.technologies.filter(t => t !== tech)
                          handleFilterChange('technologies', newTechs)
                        }}
                      />
                      <label className="text-sm">{tech}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <Select
                  value={filters.industry}
                  onValueChange={(value: string) => handleFilterChange('industry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Filters</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.has_requirements}
                      onCheckedChange={(checked: boolean) => 
                        handleFilterChange('has_requirements', checked)
                      }
                    />
                    <label className="text-sm">Has Technical Requirements</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.has_design}
                      onCheckedChange={(checked: boolean) => 
                        handleFilterChange('has_design', checked)
                      }
                    />
                    <label className="text-sm">Has Design/Mockups</label>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      {Object.keys(filters).some(key => {
        const value = filters[key as keyof typeof filters]
        return Array.isArray(value) ? value.length > 0 : Boolean(value)
      }) && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null
            return (
              <Badge
                key={key}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {key.replace('_', ' ')}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleFilterChange(key, Array.isArray(value) ? [] : '')}
                >
                  ×
                </Button>
              </Badge>
            )
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilters({
                budget_min: '',
                budget_max: '',
                timeline: '',
                search: '',
                location: '',
                technologies: [],
                industry: '',
                project_size: [0, 100000],
                has_requirements: false,
                has_design: false
              })
            }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
} 