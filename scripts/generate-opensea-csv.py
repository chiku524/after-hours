import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "collection" / "metadata" / "_metadata.json"
OUT = ROOT / "public" / "collection" / "metadata.csv"


def main() -> None:
    items = json.loads(SRC.read_text(encoding="utf-8"))
    trait_order = [attr["trait_type"] for attr in items[0]["attributes"]]
    headers = [
        "tokenID",
        "name",
        "description",
        "file_name",
        "external_url",
        *[f"attributes[{trait}]" for trait in trait_order],
    ]

    with OUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle, quoting=csv.QUOTE_NONNUMERIC, lineterminator="\n")
        writer.writerow(headers)
        for index, item in enumerate(items, start=1):
            traits = {attr["trait_type"]: attr["value"] for attr in item["attributes"]}
            writer.writerow(
                [
                    index,
                    item["name"],
                    item["description"],
                    Path(item["image"]).name,
                    item.get("external_url", ""),
                    *[traits.get(trait, "") for trait in trait_order],
                ]
            )

    print(f"Wrote {OUT.relative_to(ROOT)} ({len(items)} tokens)")


if __name__ == "__main__":
    main()
