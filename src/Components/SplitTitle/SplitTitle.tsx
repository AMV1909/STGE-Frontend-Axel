import "./SplitTitle.css";

export function SplitTitle({ title }: { title: string }) {
    return (
        <div className="stge__split-title">
            <h1>{title}</h1>
            <p>Plan Padrino</p>
            <p>Universidad Autónoma de Bucaramanga</p>
        </div>
    );
}
