import { RemoteComponents } from './types';

export class DashboardConfig {
	public readonly DASHBOARD_ENDPOINT?: string;

	public readonly REMOTE_COMPONENTS: RemoteComponents;

	public static DASHBOARD_CONFIG_SINGLETON: DashboardConfig;

	private constructor(conf: {
		DASHBOARD_ENDPOINT: any;
		RemoteComponents: any;
	})
	{
		if (!conf.RemoteComponents) {
			throw new Error('missing dashboard config data');
		}

		this.DASHBOARD_ENDPOINT = conf.DASHBOARD_ENDPOINT;
		this.REMOTE_COMPONENTS = conf.RemoteComponents;
	}

	private static fromEnvOrWindow(): DashboardConfig {
		const dashboardconfig = process.env.DASHBOARD_CONFIG;

		if (!dashboardconfig) {
			throw Error('no DASHBOARD_CONFIG found');
		}


		const dashboardConfig = JSON.parse(dashboardconfig);

		if (
			!dashboardConfig.DASHBOARD_ENDPOINT ||
			!dashboardConfig.RemoteComponents
		)
		{
			throw Error('missing configuration components');
		}

		return new DashboardConfig(dashboardConfig);
	}

	private static async fromRemote(
		basePath: string = '',
	): Promise<DashboardConfig> {
		const res = await fetch(`${ basePath }/config/test`);
		const data = await res.json();

		return new DashboardConfig(data.Data);
	}
	//
	// private static fromFile(): DashboardConfig {
	// 	return { DASHBOARD_ENDPOINT: "", REMOTE_COMPONENTS };
	// }

	public static async createDashboardConfigSingletonAsync(): Promise<DashboardConfig> {
		if (process.env.SERVER_OFFLINE === 'true') {
			DashboardConfig.DASHBOARD_CONFIG_SINGLETON =
				DashboardConfig.fromEnvOrWindow();
		} else {
			DashboardConfig.DASHBOARD_CONFIG_SINGLETON =
				await DashboardConfig.fromRemote(process.env.SERVER_BASE_PATH ?? '');
		}

		return DashboardConfig.DASHBOARD_CONFIG_SINGLETON;
	}
}
