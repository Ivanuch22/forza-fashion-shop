"use client";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/ui/shadcn/drawer";
import { MenuIcon } from "lucide-react";
import { type ReactNode, useState } from "react";

export const NavMobileMenu = ({ className, children }: { className?: string; children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className={className}>
			<Drawer direction={"left"} open={isOpen} onOpenChange={setIsOpen}>
				<DrawerTrigger aria-label="mobile menu">
					<MenuIcon />
				</DrawerTrigger>
				<DrawerContent className=" fixed top-[-100px] bottom-[-100px] left-0 sm:fixed sm:bottom-0 rigth-auto sm:right-0 sm:top-0 sm:mt-0 sm:flex sm:h-full w-2/3 sm:flex-col sm:overflow-hidden rounded-none sm:bg-white sm:shadow-xl lg:w-1/3">
					<div className=" divide-y divide-neutral-200">
						<DrawerHeader className="relative">
							<DrawerTitle className="text-[22px] font-bold text-left">Menu</DrawerTitle>
							<DrawerDescription className="sr-only">Navigation menu</DrawerDescription>
							<DrawerTrigger className="w-[20px] h-[20px] absolute right-[10px] top-[35%] ">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
									focusable="false"
									className="w-full h-full"
									fill="none"
									viewBox="0 0 18 17"
								>
									<path
										d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
										fill="currentColor"
									></path>
								</svg>
							</DrawerTrigger>
						</DrawerHeader>
						<div
							onClick={(e) => {
								if (e.target instanceof HTMLElement && e.target.closest("a")) {
									setIsOpen(false);
								}
							}}
						>
							{children}
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
};
