import { Request, Response } from 'express';
export interface route {
	path: string;
	method: string;
	function: RouteHandler;
	uploader?: RouteHandler;
	private: boolean;
	permission?: string;
	perm_component?: string;
}

export type RouteHandler = (req: Request, res: Response) =>  Promise<Response>;