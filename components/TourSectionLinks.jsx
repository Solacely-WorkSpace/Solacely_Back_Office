import clsx from "clsx";

export default function TourSectionLinks({ isActive, setIsActive }) {
    return (
        <div className="w-fit flex gap-2 md:gap-4 flex-nowrap p-4">
            <button
                onClick={() => setIsActive(0)}
                className={clsx("py-3 px-6 rounded-xl font-semibold text-sm  cursor-pointer relative text-black/40 ",
                    {
                        "btn-primary text-white": isActive === 0
                    }
                )}
            >
                Apartment
            </button>

            <button
                onClick={() => setIsActive(1)}
                className={clsx("py-3 px-6 rounded-xl font-semibold text-sm  cursor-pointer relative text-black/40 ",
                    {
                        "btn-primary text-white": isActive === 1
                    }
                )}
            >
                Co-living Space
            </button>

            <button
                onClick={() => setIsActive(2)}
                className={clsx("py-3 px-6 rounded-xl font-semibold text-sm  cursor-pointer relative text-black/40 ",
                    {
                        "btn-primary text-white": isActive === 2
                    }
                )}
            >
                <p
                    className={clsx("absolute -top-3 -right-6 bg-complementary text-white text-[10px] p-1 rounded-md z-40",
                        {
                            "block": isActive !== 2,
                            "hidden": isActive === 2
                        }
                    )}
                >
                    Coming Soon
                </p>

                Pair With Me
            </button>

            <button
                onClick={() => setIsActive(3)}
                className={clsx("py-3 px-6 rounded-xl font-semibold text-sm  cursor-pointer relative text-black/40 ",
                    {
                        "btn-primary text-white": isActive === 3
                    }
                )}
            >
                <p
                    className={clsx("absolute -top-3 -right-6 bg-complementary text-white text-[10px] p-1 rounded-md z-40",
                        {
                            "block": isActive !== 3,
                            "hidden": isActive === 3
                        }
                    )}
                >
                    Coming Soon
                </p>

                Real Estate
            </button>
        </div>
    )
}
