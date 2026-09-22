import { useLoaderData, useNavigate, useRouteError, useSearchParams } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate, queryGraphQL } from "../shopify.server";
import { GET_PRODUCTS } from "../graphql/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Package, 
  Search, 
  MoreHorizontal, 
  ArrowUpDown, 
  Filter,
  ExternalLink,
  Edit,
  Trash2
} from "lucide-react";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const url = new URL(request.url);
  const after = url.searchParams.get("after");
  const before = url.searchParams.get("before");
  const limit = 10;

  let variables = { first: limit };
  if (after) {
    variables = { first: limit, after };
  } else if (before) {
    variables = { last: limit, before };
  }

  const response = await queryGraphQL(request, GET_PRODUCTS, variables);

  return {
    products: response.data.products.edges.map((edge) => edge.node),
    pageInfo: response.data.products.pageInfo,
  };
};

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

export default function ProductsPage() {
  const { products, pageInfo } = useLoaderData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handlePrev = (e) => {
    e.preventDefault();
    if (pageInfo.hasPreviousPage) {
      navigate(`?before=${pageInfo.startCursor}`);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (pageInfo.hasNextPage) {
      navigate(`?after=${pageInfo.endCursor}`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'default'; // We'll override color with className
      case 'DRAFT':
        return 'secondary';
      case 'ARCHIVED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100/80 border-gray-200';
      case 'ARCHIVED':
        return 'text-muted-foreground border-dashed';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog, inventory, and pricing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export</Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <Separator />

      {/* Main Content */}
      <Card className="border-0 shadow-none bg-transparent">
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" className="h-9">
               <Filter className="mr-2 h-4 w-4" />
               Filter
             </Button>
             <Button variant="outline" size="sm" className="h-9">
               <ArrowUpDown className="mr-2 h-4 w-4" />
               Sort
             </Button>
          </div>
        </div>

        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead className="w-[300px]">Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="group">
                  <TableCell className="py-4">
                    {product.featuredImage ? (
                      <div className="h-12 w-12 rounded-md overflow-hidden border bg-muted">
                        <img
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText || product.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center border">
                        <Package className="h-5 w-5 text-muted-foreground/50" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-foreground/90">{product.title}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {product.handle}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`font-medium ${getStatusColor(product.status)}`}
                    >
                      {product.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                       {/* Placeholder for inventory if available, else 'N/A' */}
                       Tracked
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium text-base">
                    {product.variants.edges[0]?.node.price ? formatCurrency(product.variants.edges[0].node.price) : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit product
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View on store
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-[400px] text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">No products found</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto mb-4">
                        You haven't added any products yet. Start by adding your first product.
                      </p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>10</strong> of <strong>{products.length}</strong> products
          </div>
          <Pagination className="justify-end w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={handlePrev}
                  className={!pageInfo.hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={handleNext}
                  className={!pageInfo.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
}
