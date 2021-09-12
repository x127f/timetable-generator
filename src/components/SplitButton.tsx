import React, { ReactNode } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import { Box } from "@material-ui/core";

export default function SplitButton({
	children,
	label,
	onClick,
	className,
	startIcon,
}: {
	children: ReactNode;
	startIcon?: ReactNode;
	label?: string;
	className?: string;
	onClick?: () => void;
}) {
	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef<HTMLDivElement>(null);

	const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
		setOpen(false);
	};

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
		if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
			return;
		}

		setOpen(false);
	};

	return (
		<ButtonGroup
			className={className}
			variant="contained"
			color="primary"
			ref={anchorRef}
			aria-label="split button"
		>
			<Button onClick={onClick}>{label}</Button>
			<Button
				color="primary"
				size="small"
				aria-controls={open ? "split-button-menu" : undefined}
				aria-expanded={open ? "true" : undefined}
				aria-haspopup="menu"
				onClick={handleToggle}
			>
				<ArrowDropDownIcon />
			</Button>
			<Popper
				open={open}
				anchorEl={anchorRef.current}
				placement="bottom-end"
				role={undefined}
				transition
				disablePortal
			>
				{({ TransitionProps, placement }) => (
					<Grow {...TransitionProps}>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList>{children}</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</ButtonGroup>
	);
}
