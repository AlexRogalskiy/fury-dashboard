import {DashboardConfig} from "../Services/ConfigurationLoader/DashboardConfig";

export class NoModuleConfigurationError extends Error {
  
  constructor(moduleName: string, conf: DashboardConfig) {
    
    const err = {
      error: "Module configuration for: " + moduleName + " not found",
      config: conf
    };
    
    super(JSON.stringify(err));
  }
}