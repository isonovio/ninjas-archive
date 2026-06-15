// suppress :hover after an element is clicked
// restore after cursor leaves

function mouseLeaveNode(e: MouseEvent, node: HTMLElement) {
    const rect = node.getBoundingClientRect();
    return (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
    );
}

export function suppressAfterClick(node: HTMLElement) {
    function restoreAfterLeaving(e: MouseEvent) {
        if (mouseLeaveNode(e, node)) {
            node.style.pointerEvents = "";
            document.removeEventListener("mousemove", restoreAfterLeaving);
        }
    }

    function suppress() {
        node.style.pointerEvents = "none";
        document.addEventListener("mousemove", restoreAfterLeaving);
    }

    node.addEventListener("click", suppress);

    return {
        destroy() {
            node.removeEventListener("click", suppress);
        },
    };
}
