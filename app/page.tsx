// Import the e-commerce layout and page components
import EcommerceLayout from './(e-comm)/layout';
import EcommercePage from './(e-comm)/page';

export default function RootPage(props: any) {
  return (
    <EcommerceLayout>
      <EcommercePage {...props} />
    </EcommerceLayout>
  );
}
