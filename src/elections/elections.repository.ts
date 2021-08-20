import { Election } from "./elections.entity";
import { EntityRepository, Repository } from 'typeorm';
import { ElectionDto } from "src/elections/interfaces/election.dto";

@EntityRepository(Election)
export class ElectionRepository extends Repository<Election> {
  createElection = async (electionDto: ElectionDto) => {
    return await this.save(electionDto);
  };
}
