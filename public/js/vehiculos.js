document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
        await fetch("/logout", {
            method: "POST"
        });

        // redirigir al login
        window.location.href = "/";

    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
});