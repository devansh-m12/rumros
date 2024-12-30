import  LandingHeader  from "@/components/ui/landingHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <LandingHeader />
            {children}
        </>
    );
}