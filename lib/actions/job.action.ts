import { readFileSync } from "fs";
import path from "path";
import { GetJobsParams } from "./shared.types";

let _jSearch: any;
let _countries: any;

export async function getCountryFilters() {
	try {
		if (!_countries) {
			const file = path.join(process.cwd(), "content", "countries.json");

			const fileSync = readFileSync(file, "utf-8");

			const jsonData = JSON.parse(fileSync);

			_countries = jsonData;
		}

		const result = _countries.map((country: any) => ({
			name: country.name,
			value: country.cca2,
		}));

		return result;
	} catch (error) {
		console.log("🔴 Error getting country list", error);
		throw error;
	}
}

export async function getJobs(params: GetJobsParams) {
	try {
		const {
			page = 1,
			pageSize = 10,
			filter,
			location,
			remote,
			wage,
			skills,
			searchQuery,
		} = params;

		const skipAmount = (page - 1) * pageSize;

		if (!_jSearch) {
			const file = path.join(process.cwd(), "content", "jsearch.json");
			const fileSync = readFileSync(file, "utf8");

			const jsonData = JSON.parse(fileSync);

			_jSearch = jsonData;
		}

		const allJobs = _jSearch.data || [];

		const searchQueryRegExp = new RegExp(
			(searchQuery || "").toLowerCase(),
			"i"
		);
		const locationRegExp = new RegExp((location || "").toLowerCase(), "i");

		const filteredJobs = allJobs.filter((job: any) => {
			return (
				job &&
				searchQueryRegExp.test(job.job_title) &&
				locationRegExp.test(job.job_country) &&
				(!remote || job.job_is_remote === true) &&
				(!wage ||
					(job.job_min_salary !== null && job.job_max_salary !== null)) &&
				(!skills || job.job_required_skills)
			);
		});

		let filterOptions = {
			job_employment_type: "",
		};

		switch (filter) {
			case "fulltime":
				filterOptions = { job_employment_type: "FULLTIME" };
				break;
			case "parttime":
				filterOptions = { job_employment_type: "PARTTIME" };
				break;
			case "contractor":
				filterOptions = { job_employment_type: "CONTRACTOR" };
				break;
			case "intern":
				filterOptions = { job_employment_type: "INTERN" };
				break;
			default:
				filterOptions = { job_employment_type: "" };
				break;
		}

		const data = filteredJobs
			.filter((job: any) =>
				filterOptions.job_employment_type !== ""
					? job.job_employment_type === filterOptions.job_employment_type
					: true
			)
			.slice(skipAmount, skipAmount + pageSize);

		const totalJobs = filteredJobs.filter((job: any) =>
			filterOptions.job_employment_type !== ""
				? job.job_employment_type === filterOptions.job_employment_type
				: true
		);

		const isNext = totalJobs.length > skipAmount + data.length;

		return { data, isNext };
	} catch (error) {
		console.log(error);
		throw error;
	}
}
