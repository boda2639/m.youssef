// ==========================================
// LOAD NAVBAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const navbarContainer =
            document.getElementById("navbar-container");

        if (!navbarContainer) {
            console.error(
                "لم يتم العثور على navbar-container"
            );

            return;
        }

        try {

            const response =
                await fetch("./navbar.html");

            if (!response.ok) {
                throw new Error(
                    "تعذر تحميل navbar.html"
                );
            }

            const navbarHTML =
                await response.text();

            navbarContainer.innerHTML =
                navbarHTML;


            // ==================================
            // MOBILE MENU
            // ==================================

            const mobileMenuBtn =
                document.getElementById(
                    "mobileMenuBtn"
                );

            const mobileNavbarMenu =
                document.getElementById(
                    "mobileNavbarMenu"
                );


            if (
                mobileMenuBtn &&
                mobileNavbarMenu
            ) {

                mobileMenuBtn.addEventListener(
                    "click",
                    () => {

                        mobileNavbarMenu
                            .classList
                            .toggle("open");


                        const icon =
                            mobileMenuBtn
                                .querySelector("i");


                        if (
                            mobileNavbarMenu
                                .classList
                                .contains("open")
                        ) {

                            icon.className =
                                "fa-solid fa-xmark";

                        } else {

                            icon.className =
                                "fa-solid fa-bars";

                        }

                    }
                );

            }


            // ==================================
            // ACTIVE PAGE
            // ==================================

            const currentPage =
                window.location.pathname
                    .split("/")
                    .pop() ||
                "index.html";


            const links =
                navbarContainer
                    .querySelectorAll("a");


            links.forEach(
                (link) => {

                    const href =
                        link
                            .getAttribute("href");


                    if (
                        href === currentPage
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                }
            );

        } catch (error) {

            console.error(
                "خطأ في تحميل Navbar:",
                error
            );

        }

    }
);