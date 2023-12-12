initMain() {
    defaultPartText=$'import { parseInput } from "../utils/utils";\n
export default async function main() {
  const lines = await parseInput("'$1$'");
  console.log(lines);
  // Solution code here...
  return 0;
};\n
console.log('$1'.'$2$', await main());\n'
    echo "$defaultPartText"
}

for i in $(seq 1 25); do
    if [ ! -d "$i" ]; then
        mkdir -p $i
        echo "# Add input file $i" >$i/input.txt
        initMain $i 1 >$i/part1.ts
        initMain $i 2 >$i/part2.ts
        echo "// Utils of part $i" >$i/utils.ts
    fi
done
